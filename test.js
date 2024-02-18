const data = [
  {
    executed: false,
    executed_qty: 0,
    order_number: 202312240000000000,
    order_numbers: undefined,
    price: 205.50,
    qty: 500,
    side: "B",
    status: "Canceled",
    cumQ: 500
  },
  {
    executed: false,
    executed_qty: 0,
    order_number: 202312240000000000,
    order_numbers: undefined,
    price: 205.50,
    qty: 900,
    side: "B",
    status: "Canceled",
    cumQ: 900
  },
  {
    executed: false,
    executed_qty: 0,
    order_number: 202312240000000000,
    order_numbers: undefined,
    price: 200,
    qty: 500,
    side: "B",
    status: "Canceled",
    cumQ: 500
  },
  {
    executed: false,
    executed_qty: 0,
    order_number: 202312240000000000,
    order_numbers: undefined,
    price: 200,
    qty: 500,
    side: "B",
    status: "Canceled",
    cumQ: 500
  },
];



const priceInfo = {};
const res = data.reduce((result, item) => {
  const { qty, price } = item;
  const roundedPrice = Number(price.toFixed(2));

  if (priceInfo[roundedPrice]) {
    priceInfo[roundedPrice].order_numbers++;
    priceInfo[roundedPrice].cumQ += qty;
  } else {
    priceInfo[roundedPrice] = {
      order_numbers: 1,
      cumQ: qty
    };
  }

  const matchingItem = result.find((i) => i?.price?.toFixed(2) === roundedPrice.toFixed(2));

  if (matchingItem) {
    matchingItem.order_numbers = priceInfo[roundedPrice].order_numbers;
    matchingItem.cumQ = priceInfo[roundedPrice].cumQ;
  } else {
    const newItem = { ...item, order_numbers: priceInfo[roundedPrice].order_numbers, cumQ: priceInfo[roundedPrice].cumQ };
    result.push(newItem);
  }

  return result;
}, []);

console.log(res);