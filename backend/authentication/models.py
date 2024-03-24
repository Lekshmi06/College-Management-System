from django.db import models
from django.contrib.auth.models import AbstractUser
import random
import string
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

def validate_mobile_number(value):
    if len(value) != 10:
        raise ValidationError('Mobile number must be exactly 10 digits.')

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
     first_name = models.CharField(max_length=20)
     last_name = models.CharField(max_length=20)
     password = models.CharField(max_length=6, blank=True, null=True)
     email = models.EmailField(unique=True)
     mobile_number = models.CharField(unique=True, max_length=10,
               validators=[RegexValidator(r'^\d{10}$', 'Mobile number must be exactly 10 digits.')],                        
               null= True, blank = True)
     is_active = models.BooleanField(default=False)
     is_teacher = models.BooleanField(default=False)
     is_accountant = models.BooleanField(default=False)
     department = models.ForeignKey(Department, on_delete=models.CASCADE,blank=True, null=True)
     subject = models.CharField(max_length=100, blank=True, null=True)

class Student(models.Model):
    first_name = models.CharField(max_length=10)
    last_name = models.CharField(max_length=10)
    address = models.CharField(max_length=50)
    parent = models.CharField(max_length=10)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(unique=True, max_length=10,
                 validators=[RegexValidator(r'^\d{10}$', 'Mobile number must be exactly 10 digits.')],
                 null= True, blank = True)
    academic_percentage = models.DecimalField(max_digits=10, decimal_places=2)
    joining_year = models.IntegerField()
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE,blank=True, null=True)
    semester_fees = models.DecimalField(max_digits=10, decimal_places=2)  # Define semester fee field
    admission_number = models.CharField(max_length=10, unique=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Generate admission number if it doesn't exist
        if not self.admission_number:
            self.admission_number = generate_admission_number()  # Define your logic to generate admission number

        super().save(*args, **kwargs)

class Assignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    # Add other fields related to the assignment

    def __str__(self):
        return f"{self.student.first_name} {self.student.last_name} - Assigned to: {self.teacher.username}"        

def generate_admission_number():
 # Generate a random alphanumeric string for admission number
  length = 4 # Adjust the length of the admission number as needed
  digits = string.digits
  return ''.join(random.choices(digits, k=4))
         

class BusFee(models.Model):
    student = models.OneToOneField(Student, on_delete=models.CASCADE, related_name='bus_fee')
    location = models.CharField(max_length=100)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    # paid = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['student']
        
class Fine(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    # paid = models.BooleanField(default=False)     

    
class StudentPaymentRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    semester_paid = models.BooleanField(default=False)
    bus_fee = models.ForeignKey(BusFee, on_delete=models.SET_NULL, blank=True, null=True)
    fine = models.ForeignKey(Fine, on_delete=models.SET_NULL, blank=True, null=True)
    payment_date = models.DateField(auto_now_add=True)

    def get_semester_fee(self):
        return self.student.semester_fee if self.semester_paid else Decimal('0.00')

    def get_fine_amount(self):
        return self.fine.amount if self.fine else Decimal('0.00')

    def get_bus_fee_amount(self):
        return self.bus_fee.fee_amount if self.bus_fee else Decimal('0.00')
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # if self.bus_fee:
        #     self.bus_fee.paid = True
        #     self.bus_fee.save()
        # if self.fine:
        #     self.fine.paid = True
        #     self.fine.save()

        
    


class AttendanceRegister(models.Model):
    date = models.DateField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE)  # Assuming User model represents students
    present = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date} - {self.student.username} - {'Present' if self.present else 'Absent'}"
    



class Notification(models.Model):
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)


