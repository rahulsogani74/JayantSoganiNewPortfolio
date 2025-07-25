from mongoengine import Document, StringField, DateTimeField, EnumField
import datetime

class NonValidateUser(Document):
    meta = {'collection': 'nonValidateUser'}
    name = StringField(required=True, trim=True)
    email = StringField(required=True, unique=True, trim=True)
    password = StringField()
    role = EnumField(
        choices=("USER", "ADMIN"),
        required=True,
        default="USER"
    )
    otp = StringField(default="", trim=True)
    created_on = DateTimeField(default=datetime.datetime.utcnow)
    last_modified = DateTimeField(default=datetime.datetime.utcnow)
    email_sent_time = DateTimeField(default=None)
    expiration_time = DateTimeField(default=None)

    def save(self, *args, **kwargs):
        self.last_modified = datetime.datetime.utcnow()
        super(NonValidateUser, self).save(*args, **kwargs)
