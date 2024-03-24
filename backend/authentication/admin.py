from django.contrib import admin
from .models import CustomUser, Department,BusFee,Fine,StudentPaymentRecord,Student,Notification,Assignment

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Department)
admin.site.register(Fine)
admin.site.register(Student)
admin.site.register(StudentPaymentRecord)
admin.site.register(BusFee)
admin.site.register(Assignment)
admin.site.register(Notification)
