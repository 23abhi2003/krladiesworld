/**
 * Intelligent parser for customer order slips, handwritten receipts, and item lists.
 */

export interface ParsedSlipItem {
  item_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ParsedSlipResult {
  customer_name: string;
  customer_phone: string;
  order_date: string;
  items: ParsedSlipItem[];
  total_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_mode: string;
  notes: string;
}

export function parseOrderSlipText(text: string): ParsedSlipResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  let customer_name = '';
  let customer_phone = '';
  let paid_amount = 0;
  let payment_mode = 'Cash';
  const notesLines: string[] = [];
  const items: ParsedSlipItem[] = [];

  // 1. Extract 10-digit Indian phone number
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}/;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    customer_phone = phoneMatch[0].replace(/\D/g, '').slice(-10);
  }

  // 2. Extract Customer Name
  for (const line of lines) {
    const namePrefixMatch = line.match(
      /(?:Customer|Cust|Name|Client|పేరు|కస్టమర్)\s*[:=\-]\s*([A-Za-z\u0C00-\u0C7F\s.]+)/i
    );
    if (namePrefixMatch && !customer_name) {
      customer_name = namePrefixMatch[1].trim();
      break;
    }
  }

  // If no name prefix found, look at the first non-header line that isn't a number
  if (!customer_name) {
    for (const line of lines.slice(0, 3)) {
      if (
        !line.match(/KR\s*Ladies/i) &&
        !line.match(/Invoice|Receipt|Order|Bill|Date|Total|Ph/i) &&
        !line.match(/^\d+$/) &&
        line.length > 2 &&
        line.length < 30
      ) {
        // Strip any phone numbers from line
        const cleaned = line.replace(phoneRegex, '').replace(/[:,\-]/g, '').trim();
        if (cleaned.length >= 3) {
          customer_name = cleaned;
          break;
        }
      }
    }
  }

  // 3. Scan line-by-line for items, quantities, and prices
  // Category detection keywords
  const categoryKeywords: Record<string, string[]> = {
    Sarees: ['saree', 'sari', 'pattu', 'silk', 'cotton', 'chiffon', 'georgette', 'kanchi', 'చీర'],
    Bangles: ['bangle', 'bangles', 'kangan', 'chudi', 'గాజులు', 'మట్టి గాజులు'],
    Dresses: ['dress', 'kurti', 'chudidar', 'frock', 'suit', 'lehenga', 'డ్రెస్', 'కుర్తీ'],
    Accessories: ['accessory', 'clip', 'pin', 'makeup', 'bindi', 'fancy', 'ఉపకరణాలు'],
    Gifts: ['gift', 'packing', 'cover', 'box', 'గిఫ్ట్'],
  };

  for (const line of lines) {
    const lower = line.toLowerCase();

    // Check for Advance / Paid
    const advanceMatch = line.match(/(?:adv(?:ance)?|paid|అడ్వాన్స్)\s*[:=\-]?\s*₹?\s*(\d+)/i);
    if (advanceMatch) {
      paid_amount = Number(advanceMatch[1]) || 0;
      continue;
    }

    // Check for Payment mode (UPI, PhonePe, GPay, Cash)
    if (lower.includes('phonepe') || lower.includes('gpay') || lower.includes('upi') || lower.includes('online')) {
      payment_mode = 'UPI';
    }

    // Detect if this line represents an item
    let detectedCategory = 'Sarees';
    let matchedCat = false;
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        detectedCategory = cat;
        matchedCat = true;
        break;
      }
    }

    // Extract numbers in line (could be qty and price)
    const numbers = line.match(/\d+(?:\.\d+)?/g);

    if (matchedCat || (numbers && numbers.length > 0 && !lower.includes('total') && !lower.includes('bill') && !lower.includes('ph') && !lower.includes('date'))) {
      let qty = 1;
      let price = 0;

      // Check for explicit "2x500" or "2 * 500" or "qty: 2"
      const qtyPricePattern = /(\d+)\s*(?:x|\*|pcs|nos)?\s*[:=\-]?\s*₹?\s*(\d{2,6})/i;
      const qpMatch = line.match(qtyPricePattern);

      if (qpMatch) {
        qty = Number(qpMatch[1]) || 1;
        price = Number(qpMatch[2]) || 0;
      } else if (numbers && numbers.length >= 2) {
        // First small number might be qty, larger number price
        const num1 = Number(numbers[0]);
        const num2 = Number(numbers[1]);
        if (num1 <= 10 && num2 >= 50) {
          qty = num1;
          price = num2;
        } else {
          price = num2;
        }
      } else if (numbers && numbers.length === 1) {
        const val = Number(numbers[0]);
        if (val >= 50) {
          price = val;
        } else {
          qty = val;
        }
      }

      if (price > 0 || matchedCat) {
        // Strip numbers from item name to get descriptive title
        let itemName = line
          .replace(/\b\d+(?:\.\d+)?\b/g, '')
          .replace(/[₹\:\-\*=]/g, '')
          .trim();

        if (!itemName || itemName.length < 2) {
          itemName = `${detectedCategory} Item`;
        }

        const totalPrice = price > 0 ? (qty > 1 && price < 1000 ? qty * price : price) : 0;
        const unitPrice = qty > 0 ? Math.round(totalPrice / qty) : totalPrice;

        items.push({
          item_name: itemName,
          category: detectedCategory,
          quantity: Math.max(1, qty),
          unit_price: unitPrice,
          total_price: totalPrice,
        });
      }
    }
  }

  // Fallback if no items detected: add a generic detected item
  if (items.length === 0) {
    items.push({
      item_name: 'Custom Order from Scanned Slip',
      category: 'Sarees',
      quantity: 1,
      unit_price: 1000,
      total_price: 1000,
    });
  }

  const total_amount = items.reduce((sum, it) => sum + (it.total_price || 0), 0);
  const due_amount = Math.max(0, total_amount - paid_amount);

  return {
    customer_name: customer_name || 'Customer',
    customer_phone,
    order_date: new Date().toISOString().split('T')[0],
    items,
    total_amount,
    paid_amount,
    due_amount,
    payment_mode,
    notes: `Scanned from order slip image. ${notesLines.join(' ')}`.trim(),
  };
}
