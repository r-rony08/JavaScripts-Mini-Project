const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Load currency list in dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default values
    if (select.name === "from" && currCode === "KWD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "BDT") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update country flag
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// NEW FREE API (no API key needed)
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    // API URL
    const URL = `https://open.er-api.com/v6/latest/${fromCurr.value}`;
    let response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Could not fetch exchange rate.");
    }

    let data = await response.json();

    if (data.result === "error") {
      throw new Error("API returned an error.");
    }

    // Get target currency rate
    let rate = data.rates[toCurr.value];
    if (!rate) {
      throw new Error("Conversion currency not found.");
    }

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "⚠️ Failed to fetch exchange rate.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Swap currencies when clicking the icon
const swapIcon = document.getElementById("swap-icon");

swapIcon.addEventListener("click", () => {
  // Swap selected values
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  // Update both flags
  updateFlag(fromCurr);
  updateFlag(toCurr);

  // Refresh exchange rate
  updateExchangeRate();
});


window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
