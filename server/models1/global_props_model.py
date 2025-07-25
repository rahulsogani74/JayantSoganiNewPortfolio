from mongoengine import Document, StringField, DynamicField, EnumField

class GlobalProps(Document):
    meta = {'collection': 'globalProps'}
    key = StringField(required=True, trim=True)
    value = DynamicField(required=True)
    type = StringField(required=True, trim=True, default="GLOBAL")
    value_type = EnumField(
        choices=("String", "Number", "Object", "Array"),
        required=True,
        trim=True,
        default="String"
    )
