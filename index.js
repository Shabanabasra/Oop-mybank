#! /usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import { faker } from "@faker-js/faker";
//OOP-MYBANK
// creat class for customer
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobileNo;
    accountNo;
    constructor(fName, lName, age, gender, mobNo, accNo) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNo = mobNo;
        this.accountNo = accNo;
    }
}
// create class for bank
class Bank {
    customer = [];
    account = [];
    customerAdd(obj) {
        this.customer.push(obj);
    }
    accountNoAdd(obj) {
        this.account.push(obj);
    }
    updateTransaction(accountobj) {
        let updateAcc = this.account.filter((acc) => acc.accountNo !== accountobj.accountNo);
        this.account = [...updateAcc, accountobj];
    }
}
console.log(chalk.bold.yellow(">>>>>>>>>>>>>>>>>>>>>------------------------<<<<<<<<<<<<<<<<<<<<<<<<"));
console.log(chalk.bold.cyanBright("\n~~~~~~~~~*********| WELCOME TO MY BANK|********** ~~~~~~~~~\n"));
console.log(chalk.bold.yellow(">>>>>>>>>>>>>>>> ------------------------------<<<<<<<<<<<<<<<<<<<<<<<<"));
let myBANK = new Bank();
//create Customer
// create for loop
for (let i = 1; i <= 4; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let mobNo = parseInt(faker.string.numeric("3######"));
    const cus = new Customer(fName, lName, 18 * i, "male", mobNo, 4000 + i);
    myBANK.customerAdd(cus);
    myBANK.accountNoAdd({ accountNo: cus.accountNo, balance: 1000 * i });
}
//create bank functionallity
async function bankService(bank) {
    do {
        let services = await inquirer.prompt({
            name: "select",
            type: "list",
            message: chalk.bold.cyan("\nplease select the service?\n"),
            choices: [
                chalk.bold.green("view Balance"),
                chalk.bold.grey("Cash Withdraw"),
                chalk.bold.magenta("Cash Deposit"),
                chalk.bold.red("Exit"),
            ],
        });
        //condition for view balance 
        if (services.select == chalk.bold.green("view Balance")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:"),
            });
            let account = myBANK.account.find((acc) => acc.accountNo == response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\"nInvalid Account No ! \n"));
            }
            if (account) {
                let name = myBANK.customer.find((item) => item.accountNo == account?.accountNo);
                console.log(chalk.bold.cyan(`\nDear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} 
                your Account Balance is ${chalk.bold.green(`$${account.balance}`)}\n`));
            }
        }
        //condition for cash withdraw
        if (services.select == chalk.bold.gray("Cash withdraw")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:"),
            });
            let account = myBANK.account.find((acc) => acc.accountNo == response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\nInvalid Account No! \n"));
            }
            if (account) {
                let answer = await inquirer.prompt({
                    name: "dollar",
                    type: "number",
                    message: chalk.bold.green("\nPlease enter ypur Amount"),
                });
                if (answer.dollar > account.balance) {
                    console.log(chalk.bold.red("\nInsufficient Balance!\n"));
                }
                else {
                    console.log(chalk.bold.cyan(`\nYour Cash "$${chalk.bold.green(answer.dollar)}" withdraw Successfully ...\n`));
                }
                let newBalance = account.balance = answer.dollar;
                // updaate transaction method call
                bank.updateTransaction({
                    accountNo: account.accountNo,
                    balance: newBalance,
                });
            }
        }
        // condition for cash deposit
        if (services.select == chalk.bold.magenta("cash Deposit")) {
            let response = await inquirer.prompt({
                name: "AccNo",
                type: "input",
                message: chalk.bold.yellow("\nPlease enter your Account No:")
            });
            let account = myBANK.account.find((acc) => acc.accountNo = response.AccNo);
            if (!account) {
                console.log(chalk.red.bold("\nInvalid Account No\n "));
            }
            if (account) {
                let answer = await inquirer.prompt({
                    name: "dollar",
                    type: "number",
                    message: chalk.bold.green("\nPlease enter your Amount"),
                });
                let newBalance = account.balance + answer.dollar;
                //update transaction mehod call
                bank.updateTransaction({
                    accountNo: account.accountNo,
                    balance: newBalance,
                });
                console.log(chalk.bold.cyan(`\nYour Cash "$${chalk.bold.green(answer.dollar)}" deposit Successfully ...\n `));
            }
        }
        if (services.select == chalk.bold.red("Exit")) {
            console.log(chalk.bold.green("\n>>>>>>>........... ALWAYS CHOOSE MY BANk -----------<<<<<<<\n"));
            process.exit();
        }
    } while (true);
}
bankService(myBANK);
