import https from "https";
import readline from "readline";
import chalk from "chalk";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apiKey = '6fdfa403c1f25e12a23152ccf3'; // Replace with your actual API key
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;

https.get(url, (response) => {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end', () => {
    const parsedData = JSON.parse(data);

    if (parsedData.result !== "success") {
      console.log(chalk.red(`\nAPI Error: ${parsedData['error-type'] || 'Unknown error'}`));
      rl.close();
      return;
    }

    const rates = parsedData.conversion_rates;

    rl.question('Enter the amount in USD: ', (amountInput) => {
      const amount = parseFloat(amountInput);

      rl.question('Enter the target currency (e.g., INR, EUR, GBP): ', (currency) => {
        const upperCurrency = currency.toUpperCase();

        if (rates[upperCurrency]) {
          const converted = amount * rates[upperCurrency];
          console.log(chalk.green(`\n${amount} USD = ${converted.toFixed(2)} ${upperCurrency}`));
        } else {
          console.log(chalk.red('\nInvalid currency code.'));
        }

        rl.close();
      });
    });
  });
}).on('error', (err) => {
  console.error(chalk.red('Error fetching data:'), err.message);
});
