# Technical Integration Details

## Payment System Implementation

### Stripe Integration

```typescript
// Initialize Stripe
const stripe = await loadStripe(process.env.STRIPE_PUBLIC_KEY);

// Payment Intent creation
const createPaymentIntent = async (amount: number) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  return response.json();
};

// Process card payment
const processCardPayment = async (clientSecret: string, paymentMethod: string) => {
  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethod
  });
  if (error) throw error;
  return paymentIntent;
};

// Handle ACH payment
const processACHPayment = async (clientSecret: string, bankDetails: BankDetails) => {
  const { paymentIntent, error } = await stripe.confirmAchDebitPayment(
    clientSecret,
    { payment_method: { us_bank_account: bankDetails } }
  );
  if (error) throw error;
  return paymentIntent;
};
```

### Square Integration

```typescript
// Initialize Square
const payments = await square.payments(applicationId, locationId);

// Card payment processing
const processSquarePayment = async () => {
  const card = await payments.card();
  await card.attach('#card-container');
  const result = await card.tokenize();
  if (result.status === 'OK') {
    return processPayment(result.token);
  }
  throw new Error(result.errors?.[0]?.message || 'Payment failed');
};

// ACH payment processing
const processSquareACH = async (bankDetails: BankDetails) => {
  const response = await fetch('/api/process-square-ach', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bankDetails)
  });
  return response.json();
};
```

## Financial System Integration

### Patriot Software Integration

```typescript
// Initialize Patriot client
const patriot = new PatriotClient({
  apiKey: process.env.PATRIOT_API_KEY,
  companyId: process.env.PATRIOT_COMPANY_ID,
  environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
});

// Sync employee data
const syncEmployees = async () => {
  const employees = await fetchEmployees();
  return patriot.employees.bulkUpdate(employees);
};

// Process payroll
const processPayroll = async (payrollData: PayrollData) => {
  const result = await patriot.payroll.create({
    payPeriod: payrollData.period,
    employees: payrollData.employees,
    deductions: payrollData.deductions
  });
  return result;
};

// Generate reports
const generateReports = async (startDate: Date, endDate: Date) => {
  const reports = await patriot.reports.generate({
    type: 'payroll_summary',
    startDate,
    endDate,
    format: 'pdf'
  });
  return reports;
};
```

## API Endpoints

### Payment Endpoints

```typescript
// Payment intent creation
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd'
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payment webhook handling
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    handleWebhookEvent(event);
    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
```

### Financial System Endpoints

```typescript
// Employee sync endpoint
app.post('/api/sync-employees', async (req, res) => {
  try {
    const result = await syncEmployees();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Payroll processing endpoint
app.post('/api/process-payroll', async (req, res) => {
  try {
    const result = await processPayroll(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```