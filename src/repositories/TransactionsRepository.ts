import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransationDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

enum Type {
  INCOME = 'income',
  OUTCOME = 'outcome',
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter(transaction => transaction.type === operator)
      .map(transaction => transaction.value)
      .reduce((acc, value) => {
        return acc + value;
      }, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.INCOME);
    const outcome = this.calculateBalance(Type.OUTCOME);

    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    /* transactions.reduce((res, value): Balance => {
      if (value.type === 'income') {
        res.income += value.value;
        res.total += value.value;
      } else {
        res.outcome += value.value;
        res.total -= value.value;
      }
      return res;
    }, balance); */

    return balance;
  }

  public create({ title, value, type }: CreateTransationDTO): Transaction {
    const transation = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === Type.OUTCOME && total < value) {
      throw Error('Cannot create outcome transaction without a valid balance');
    }

    this.transactions.push(transation);

    return transation;
  }
}

export default TransactionsRepository;
