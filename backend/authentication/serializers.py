from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import  CustomUser,Department,BusFee,Fine,Student,StudentPaymentRecord, AttendanceRegister,Notification, Assignment
 


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'is_active', 'is_teacher', 'is_accountant', 'last_name', 'first_name', 'mobile_number', 'subject', 'department', 'username']
        
    def create(self, validated_data):
        user = CustomUser.objects.create(**validated_data)
        return user

    
class UserApprovalSerializer(serializers.Serializer):
    id = serializers.IntegerField()  # Ensure id is properly defined as an IntegerField
    is_active = serializers.BooleanField()

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass
    
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'      

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'     

class BusFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusFee
        fields = '__all__'  
        extra_kwargs = {
            'location': {'required': False},
            'fee_amount': {'required': False},
            
        } 

class FineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fine
        fields = '__all__'   
        extra_kwargs = {
            'name': {'required': False},
            'description': {'required': False},
            'amount': {'required': False},
            
        }                      

class StudentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    teacher_name = serializers.SerializerMethodField()
    class Meta:
        model = Student
        fields = '__all__' 
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'address': {'required': False},
            'parent': {'required': False},
            'dob': {'required': False},
            'email': {'required': False},
            'academic_percentage': {'required': False},
            'joining_year': {'required': False},
            'semester_fees': {'required': False},
            'profile_pic': {'required': False},
        } 

    def get_teacher_name(self, obj):
        assignment = Assignment.objects.filter(student=obj).first()
        if assignment:
            teacher_id = assignment.teacher.id
            first_name = assignment.teacher.first_name
            last_name = assignment.teacher.last_name
            full_name = f"{first_name} {last_name}"
            return (full_name, teacher_id)
            
        return None

class StudentPaymentSerializer(serializers.ModelSerializer):
    fine_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='fine.amount', read_only=True)
    bus_fee_amount = serializers.DecimalField(max_digits=10, decimal_places=2, source='bus_fee.fee_amount', read_only=True)

    class Meta:
        model = StudentPaymentRecord
        fields = '__all__'         
        
# class StudentPaymentSerializer(serializers.ModelSerializer):
#     bus_fee_status = serializers.SerializerMethodField()
#     fine_status = serializers.SerializerMethodField()

#     class Meta:
#         model = StudentPaymentRecord
#         fields = '__all__'

#     def get_bus_fee_status(self, obj):
#         return obj.bus_fee.paid if obj.bus_fee else False

#     def get_fine_status(self, obj):
#         return obj.fine.paid if obj.fine else False
class AttendenceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.first_name', read_only=True)
    adm_no = serializers.CharField(source='student.admission_number', read_only=True)
    class Meta:
        model = AttendanceRegister
        fields = '__all__'     
class PasswordResetSerializer(serializers.Serializer):
    username = serializers.CharField()
    current_password = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except serializers.ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'recipient', 'message', 'timestamp', 'is_read']        