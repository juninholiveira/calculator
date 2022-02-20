//Aqui eu busco no HTML e guardo nas variáveis todos os Buttons com os atributos definidos
const numberButtons = document.querySelectorAll('[data-number]');                           //Procura no documento os botões com atributo 'data-number'
const operationButtons = document.querySelectorAll('[data-operation]');                     //Procura no documento os botões com atributo 'data-operation'
const equalsButton = document.querySelector('[data-equals]');                               //Procura no documento o botão com atributo 'data-equals'
const deleteButton = document.querySelector('[data-delete]');                               //Procura no documento o botão com atributo 'data-delete'
const allClearButton = document.querySelector('[data-all-clear]');                          //Procura no documento o botão com atributo 'data-all-clear'
const previousOperandTextElement = document.querySelector('[data-previous-operand]');       //Procura no documento o botão com atributo 'data-previous-operand'
const currentOperandTextElement = document.querySelector('[data-current-operand]');         //Procura no documento o botão com atributo 'data-current-operand'

let currentOperand;                                                                         //Essa variável guarda na memória o atual valor do visor principal
let previousOperand;                                                                        //Essa variável guarda o valor (apenas o número) que está no visor superior

//Constrói a classe 'Calculator' e salva na variável 'calculator', passando como parâmetros os campos de texto do visor da calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

//Adiciona um EventListener de click para cada botão na variável 'numberButtons'
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        //Se o valor no visor superior for vazio, se houver alguma coisa no valor principal
        //e se a variável 'readyToReset' estiver marcada como true (ou seja, acabou de fazer um cálculo e pode ser zerada),
        //então eu apago o valor do visor principal e marco a variável para não zerar.
        if(calculator.previousOperand === "" && calculator.currentOperand !== "" && calculator.readyToReset) 
        {
            calculator.currentOperand = "";
            calculator.readyToReset = false;
        }

        calculator.appendNumber(button.innerText);                  //Chama a função 'appendNumber' e passa pra ela como parâmetro o número que está no botão
        calculator.updateDisplay();                                 //Chama a função 'updateDisplay'
    })
})

//Adiciona um EventListener de click para cada botão na variável 'operationButtons'
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);               //Chama a função 'chooseOperation' e passa pra ela como parâmetro o símbolo que está no botão
        calculator.updateDisplay();                                 //Chama a função 'updateDisplay'
    })
})

//Adiciona um eventListener de click no botão de igual
equalsButton.addEventListener('click', button => {
    calculator.compute();                                           //Chama a função 'compute' que faz o cálculo dos valores nos visores
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})

//Adiciona um eventListener de click no botão de Limpar
allClearButton.addEventListener('click', button => {
    calculator.clear();                                             //Chama a função 'clear' que apaga tudo nos visores
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})

//Adiciona um eventListener de click no botão de apagar
deleteButton.addEventListener('click', button => {
    calculator.delete();                                            //Chama a função 'delete' que apaga o último valor do visor principal
    calculator.updateDisplay();                                     //Chama a função 'updateDisplay'
})