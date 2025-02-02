# KidCare Connect Technical Documentation

## Implementation Details

### User Management

```typescript
// Registration form submission
const handleRegistration = async (data: RegisterForm) => {
  try {
    await signUp(data.email, data.password);
    navigate('/login');
    alert('Registration successful! Please check your email.');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Failed to register. Please try again.');
  }
};

// Email verification handler
const verifyEmail = async (token: string) => {
  const { error } = await supabase.auth.verifyEmail(token);
  if (error) throw error;
  return true;
};

// Profile completion
const completeProfile = async (profileData: ProfileForm) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...profileData,
      role: 'parent'
    });
  if (error) throw error;
};
```

### Child Management

```typescript
// Child creation
const addChild = async (childData: ChildForm) => {
  const { data, error } = await supabase
    .from('children')
    .insert([{
      parent_id: user.id,
      ...childData
    }]);
  if (error) throw error;
  return data;
};
```

### Booking System

```typescript
// Check availability
const checkAvailability = async (date: Date) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', date.toISOString())
    .is('status', 'confirmed');
  if (error) throw error;
  return calculateAvailableSlots(data);
};

// Create booking
const createBooking = async (bookingData: BookingForm) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{
      child_id: bookingData.childId,
      start_time: bookingData.startTime,
      end_time: bookingData.endTime,
      package_type: bookingData.packageType,
      status: 'pending'
    }]);
  if (error) throw error;
  return data;
};
```

### Attendance System

```typescript
// Process check-in
const processCheckIn = async (childId: string) => {
  const { data, error } = await supabase
    .from('attendance')
    .insert([{
      child_id: childId,
      check_in_time: new Date().toISOString(),
      checked_in_by: user.id
    }]);
  if (error) throw error;
  return data;
};

// Process check-out
const processCheckOut = async (attendanceId: string) => {
  const { data, error } = await supabase
    .from('attendance')
    .update({
      check_out_time: new Date().toISOString(),
      checked_out_by: user.id
    })
    .eq('id', attendanceId);
  if (error) throw error;
  return data;
};
```

### Payment Processing

```typescript
// Add payment method
const addPaymentMethod = async (paymentData: PaymentMethodForm) => {
  const { paymentMethod, error } = await stripe.createPaymentMethod({
    type: 'card',
    card: elements.getElement('card'),
    billing_details: {
      name: paymentData.name,
      email: paymentData.email
    }
  });
  if (error) throw error;
  return paymentMethod;
};

// Process payment
const processPayment = async (amount: number, paymentMethodId: string) => {
  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: paymentMethodId
  });
  if (error) throw error;
  return paymentIntent;
};
```

### Staff Management

```typescript
// Create staff schedule
const createSchedule = async (scheduleData: ScheduleForm) => {
  const { data, error } = await supabase
    .from('staff_schedules')
    .insert([{
      staff_id: scheduleData.staffId,
      start_time: scheduleData.startTime,
      end_time: scheduleData.endTime,
      role: scheduleData.role
    }]);
  if (error) throw error;
  return data;
};

// Process payroll
const processPayroll = async (payrollData: PayrollForm) => {
  const { data, error } = await supabase
    .from('payroll')
    .insert([{
      staff_id: payrollData.staffId,
      pay_period_start: payrollData.startDate,
      pay_period_end: payrollData.endDate,
      hours_worked: payrollData.hours,
      hourly_rate: payrollData.rate,
      total_pay: payrollData.total
    }]);
  if (error) throw error;
  return data;
};
```