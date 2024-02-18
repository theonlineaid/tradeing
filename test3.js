const data = [
    {
      executed: false,
      executed_qty: 0,
      order_numbers: undefined,
      price: 1,
      qty: 1,
      side: "B",
      status: "Canceled",
      cumQ: 1
    },
    {
      executed: false,
      executed_qty: 0,

      order_numbers: undefined,
      price: 1,
      qty: 1,
      side: "B",
      status: "Canceled",
      cumQ: 1
    },
    {
        executed: false,
        executed_qty: 0,
        order_numbers: undefined,
        price: 3.10,
        qty: 3,
        side: "B",
        status: "Canceled",
        cumQ: 3
      },
    {
        executed: false,
        executed_qty: 0,
        order_numbers: undefined,
        price: 3.0999999999999999999999999999999,
        qty: 3,
        side: "B",
        status: "Canceled",
        cumQ: 3
      },
    {
      executed: false,
      executed_qty: 0,
      order_numbers: undefined,
      price: 2,
      qty: 2,
      side: "S",
      status: "Canceled",
      cumQ: 2
    },
    {
      executed: false,
      executed_qty: 0,
      order_numbers: undefined,
      price: 2,
      qty: 2,
      side: "S",
      status: "Canceled",
      cumQ: 2
    },
    {
      executed: false,
      executed_qty: 0,

      order_numbers: undefined,
      price: 5,
      qty: 5,
      side: "B",
      status: "Canceled",
      cumQ: 5
    },
    {
      executed: false,
      executed_qty: 0,

      order_numbers: undefined,
      price: 6,
      qty: 6,
      side: "B",
      status: "Canceled",
      cumQ: 6
    },
    {
      executed: false,
      executed_qty: 0,

      order_numbers: undefined,
      price: 3,
      qty: 3,
      side: "S",
      status: "Canceled",
      cumQ: 3
    },
  ];

  const separatedData = data.reduce((acc, item) => {
    if (item.side === "B") {
      acc.B.push(item);
    } else if (item.side === "S") {
      acc.S.push(item);
    }
    return acc;
  }, { B: [], S: [] });

  
  // Sort the arrays based on the specified conditions
  const sortedDataB = separatedData.B.sort((a, b) => b.price - a.price); // Descending order for side "B"
  const sortedDataS = separatedData.S.sort((a, b) => a.price - b.price); // Ascending order for side "S"
  
  // Calculate order_numbers, quantity, and cumQ properties for side "B"
  const resultB = sortedDataB.reduce((acc, item) => {
    const roundedPrice = Number(item.price.toFixed(2));
    const prevItem = acc[acc.length - 1];
    if (prevItem && prevItem.price === roundedPrice) {
      prevItem.order_numbers++;
      prevItem.qty += item.qty;
      prevItem.cumQ += item.qty;
    } else {
      const newItem = {
        ...item,
        order_numbers: 1,
        qty: item.qty,
        cumQ: (prevItem ? prevItem.cumQ : 0) + item.qty
      };
      acc.push(newItem);
    }
  
    return acc;
  }, []);
  
  // Calculate order_numbers, quantity, and cumQ properties for side "S"
  const resultS = sortedDataS.reduce((acc, item) => {
    const roundedPrice = Number(item.price.toFixed(2));
    const prevItem = acc[acc.length - 1];
  
    if (prevItem && prevItem.price === roundedPrice) {
      prevItem.order_numbers++;
      prevItem.qty += item.qty;
      prevItem.cumQ += item.qty;
    } else {
      const newItem = {
        ...item,
        order_numbers: 1,
        qty: item.qty,
        cumQ: (prevItem ? prevItem.cumQ : 0) + item.qty
      };
      acc.push(newItem);
    }
  
    return acc;
  }, []);
  
  console.log("Side B:", resultB);
  console.log("Side S:", resultS);