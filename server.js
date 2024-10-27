const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
// use cors
app.use(cors({
    origin: 'http://localhost:3000', // Allow your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
  }));

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://pratyushpushkar61:oR4Zne8vzO23k6Qi@expense-tracker-cluster.f0kod.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const Expense = require('./models/expense');

app.get('/', (req, res) => {
    res.send('Hello from node js');
});

app.post('/add-expense', async (req, res) => {
    const newExpense = new Expense({
        title: 'Petrol',
        amount: 5000
    });
    try {
        await newExpense.save();
        res.send('Expense added!');
    } catch (error) {
        res.status(500).send(error);
    }
});

// get all expenses
app.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.json(expenses);
    } catch (error) {
        res.status(500).send('Error fetching expenses: ' + error);
    }
});

// update expense by ID
app.put('/expenses/:id', async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedExpense) return res.status(404).setDefaultEncoding('Expenses not found!');
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).send('Error updating expense: ' + error);
    }
});

// delete expense by ID
app.delete('/expenses/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) return res.status(404).send('Expense not found!!');
        res.json({ message: 'Expense deleted successfully!' });
    } catch (error) {
        res.status(500).send('error deleting expense: ' + error);
    }
});

app.listen(PORT, () => {
    console.log('server is up');
});