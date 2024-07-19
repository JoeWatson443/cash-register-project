const price = 3.26;
let cid = [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100]
];


const displayChangeDue = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');
const priceDisplay = document.getElementById('price-display');
const cash = document.getElementById('cash');
const cashDrawerDisplay = document.getElementById('cash-drawer-display');

const formatResults = (status, change) => {
    displayChangeDue.classList.add('pad-16')
    displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
    change.map(
      money => (displayChangeDue.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
    );
    return;
  };

const checkCashRegister = () => {
    if (!cash.value) {
        alert('Please enter a cash amount');
    };
    
    if (Number(cash.value) === price) {
        displayChangeDue.innerHTML = 
        `<p class="pad-16">No change due - customer paid with exact cash</p>`;
        cash.value = '';
        return
    }
    
    if (Number(cash.value) < price) {
        alert('Customer does not have enough money to purchase the item');
        displayChangeDue.innerHTML = 
        `<p class="pad-16">Customer does not have enough money to purchase the item</p>`;
        cash.value = '';
        return
    }
    
    let tillTotal = parseFloat(cid.reduce((acc, item) => acc + item[1], 0)).toFixed(2);
    let changeDue = Number(cash.value) - price;
    let reversedCid = cid.map(arr => [...arr]).reverse();
    let result = { status: 'OPEN', change: [] };

 
    
    if (tillTotal < changeDue) {
        displayChangeDue.innerHTML = 
        `<p class="pad-16">Status: INSUFFICIENT_FUNDS</p>`;
        cash.value = '';
        return
    };


    if (tillTotal == changeDue) {
       result.status = 'CLOSED';
    };

    const denomValue = {
        "ONE HUNDRED": 100,
        "TWENTY": 20,
        "TEN": 10,
        "FIVE": 5,
        "ONE": 1,
        "QUARTER": 0.25,
        "DIME": 0.10,
        "NICKEL": 0.05,
        "PENNY": 0.01
    };
    
    let changeGiven = [];

    console.log(changeDue);
    
    for (let denom of reversedCid) {
        let denomInHand = 0;

        console.log(changeDue);
        
        while (changeDue >= denomValue[denom[0]] && denom[1] > 0) {
            
            denomInHand += denomValue[denom[0]];
            changeDue -= denomValue[denom[0]];
            changeDue = parseFloat(changeDue.toFixed(2));
            denom[1] -= denomValue[denom[0]];        
            console.log(`${denom[0]} has ${denom[1]}`)
          };
  
        if (denomInHand > 0) {
            changeGiven.push([denom[0], denomInHand]);
        }
      }

      if (changeDue > 0) {
        return (displayChangeDue.innerHTML = '<p class="pad-16">Status: INSUFFICIENT_FUNDS</p>');
      }
      console.log(`change given: ${changeGiven}`);
      result.change = [...changeGiven];
      
      
      updateUI(result.change)
      formatResults(result.status, result.change);
    };
    
    const updateUI = change => {
        
        const currencyNameMap = {
            PENNY: 'Pennies',
            NICKEL: 'Nickels',
            DIME: 'Dimes',
            QUARTER: 'Quarters',
            ONE: 'Ones',
            FIVE: 'Fives',
            TEN: 'Tens',
            TWENTY: 'Twenties',
            'ONE HUNDRED': 'Hundreds'
        };
        
        if (change) {
            console.log(`cid array: ${cid}`);
            change.forEach(changeArr => {
                
                const targetArr = cid.find(cidArr => cidArr[0] === changeArr[0]);
                console.log(`target array: ${targetArr}`);
            const newBalance = parseFloat((targetArr[1] - changeArr[1]).toFixed(2));
            targetArr[1] = Math.max(0, newBalance);
        });
    };

    cash.value = '';
    priceDisplay.textContent = `Total: $${price}`;
    cashDrawerDisplay.innerHTML = `<p><strong>Change in drawer:</strong></p>
      ${cid
        .map(money => `<p>${currencyNameMap[money[0]]}: $${money[1]}</p>`)
        .join('')}  
    `;
    console.log(cid)
};

cash.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        checkCashRegister();
    }
})

purchaseBtn.addEventListener('click', checkCashRegister)
