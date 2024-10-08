const body = document.getElementsByTagName("body")[0];
const img = document.getElementById("switch-img");

const mode = localStorage.getItem("mode");

if (mode === "light" || mode === "dark") {
  body.className = mode;
} else {
  body.className = 'light';
}

if(body.className){
  img.src = body.className === "light" ? "./library/sol.svg" : "./library/lua.svg";
}

const calculatorButtons = Array.from(
  document.querySelector(".keyboard").children
);

calculatorButtons.forEach((button) => {
  button.addEventListener("click", routes);
});

function routes(event) {
  const display = document.getElementById("display").innerHTML;
  const element =
    event.target.tagName === "BUTTON"
      ? event.target
      : event.target.parentElement;

  if (element.className === "special") {
    onClickSpecial(element, display);
  } else if (element.className === "basic") {
    onClickBasic(element, display);
  } else if (element.className === "operator") {
    onClickOperator(element, display);
  } else if (element.className.includes("equal")) {
    showResult(element, display);
  }
}

// TODO SPECIAL

function onClickSpecial(element, display) {
  if (element.id === "erase") {
    onClickErase();
  } else if (element.id === "plusMinus") {
    onClickPlusMinus(element, display);
  } else {
  }
}

function onClickErase() {
  document.getElementById("display").innerHTML = 0;
}

function onClickPlusMinus(element, display) {
  let numbersList = display.split(/[^0-9.]+/g);

  let lastNumber = numbersList[numbersList.length - 1];

  const OperPos = -lastNumber.length - 1;
  const lastPos = -lastNumber.length || display.length;

  let lastOperator = display.slice(OperPos, lastPos);

  if (lastOperator === "+") {
    const copyDisplay = display.slice(0, OperPos) + "-" + lastNumber;
    document.getElementById("display").innerHTML = copyDisplay;
  } else if (lastOperator === "-") {
    const copyDisplay = display.slice(0, OperPos) + "+" + lastNumber;
    document.getElementById("display").innerHTML = copyDisplay;
  }

  if (numbersList.length === 1) {
    document.getElementById("display").innerHTML *= -1;
  }
}

// TODO BASIC

function onClickBasic(element, display) {
  if (element.id === "delete") {
    onCLickDelete(display);
  } else if (element.id === "decimal") {
    onClickDecimal(element, display);
  } else {
    onClickNumber(element, display);
  }
}

function onCLickDelete(display) {
  if (display.length === 1) {
    document.getElementById("display").innerHTML = 0;
  } else {
    document.getElementById("display").innerHTML = display.slice(0, -1);
  }
}

function onClickDecimal(element, display) {
  let numbersList = display.split(/[^0-9.]+/g);
  let lastNumber = numbersList[numbersList.length - 1];
  if (!lastNumber) {
    document.getElementById("display").innerHTML += 0;
  }

  if (!lastNumber.includes(".")) {
    document.getElementById("display").innerHTML += element.innerHTML;
  }
}

function onClickNumber(element, display) {
  if (display == 0 && !display.includes(".")) {
    document.getElementById("display").innerHTML = element.innerHTML;
  } else {
    document.getElementById("display").innerHTML += element.innerHTML;
  }
}

//TODO Operator

function onClickOperator(element, display) {
  const operatorsTags = Array.from(document.getElementsByClassName("operator"));
  const operatorsTagsFiltered = operatorsTags.filter((operator) => {
    return operator.className === "operator";
  });

  const lastCharacterDisplay = display.slice(-1);
  let operators = [];

  for (let i = 0; i < operatorsTagsFiltered.length; i++) {
    operators.push(operatorsTagsFiltered[i].innerHTML);
  }
  //console.log(operators, display.slice(-1));
  if (!operators.includes(lastCharacterDisplay)) {
    document.getElementById("display").innerHTML += element.innerHTML;
  } else {
    const copyDisplay = display.slice(0, -1) + element.innerHTML;
    document.getElementById("display").innerHTML = copyDisplay;
  }
}

// TODO calculadora

function calculate(number1, operator, number2, precision) {
  const decimalLength = (num) => num.toString().split(".")[1]?.length || 0;

  const maxDecimal = Math.max(decimalLength(number1), decimalLength(number2));
  
  precision = precision || Math.pow(10, maxDecimal);

  number1 *= precision;
  number2 *= precision;

  let result;

  switch (operator.toLowerCase()) {
    case "+":
      result = number1 + number2;
      break;
    case "-":
      result = number1 - number2;
      break;
    case "x":
      precision = Math.pow(precision, 2);
      result = number1 * number2;
      break;
    case "÷":
      result = number1 / number2;
      break;
    default:
      return "error";
  }
  
  return result/precision;
}

// TODO RESULT

const showResult = () => {
  let display = document.getElementById("display").innerHTML;
  //const displayWithoutSpace = display.replaceAll(" ", "");
  let numbersList = display.split(/[^0-9.]+/g);
  let operatorsList = display.split(/[0-9.]+/g);
  if (!numbersList[0]) numbersList.shift();
  if (!operatorsList[0]) operatorsList[0] = "+";
  let total = 0;
  for (let i = 0; i < numbersList.length; i++) {
    total = calculate(total, operatorsList[i], Number(numbersList[i]));
  }
  let history = display;
  document.getElementById("history").innerHTML = history;
  document.getElementById("display").innerHTML = total;
};

const switchMode = () => {
  if (body.className === "dark") {
    body.className = "light";
    img.src = "./library/sol.svg";
  } else {
    body.className = "dark";
    img.src = "./library/lua.svg";
  }

  localStorage.setItem("mode", body.className);
};
