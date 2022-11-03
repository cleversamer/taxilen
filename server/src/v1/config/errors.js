const system = Object.freeze({
  internal: {
    en: "An unexpected error happened on the server",
    ar: "حصل خطأ غير متوقع في الخادم",
  },
  unsupportedRoute: {
    en: "Unsupported route",
    ar: "الرابط غير مدعوم",
  },
  noPhoto: {
    en: "Please add a photo",
    ar: "يجب عليك إضافة صورة",
  },
  invalidFile: {
    en: "Invalid file",
    ar: "الملف غير صالح",
  },
  fileUploadError: {
    en: "Error uploading file",
    ar: "حصل خطأ عند رفع الملف",
  },
  invalidUrl: {
    en: "Please add a valid url",
    ar: "من فضلك قم بإدخال رابط صالح",
  },
  invalidExtension: {
    en: "File extension is not supported",
    ar: "إمتداد الملف غير مدعوم",
  },
  invalidMongoId: {
    en: "Invalid document id",
    ar: "معرّف المستند غير صالح",
  },
  noMongoId: {
    en: "You should add the id",
    ar: "يجب عليك إضافة المعرّف",
  },
});

const auth = Object.freeze({
  invalidCode: {
    en: "Invalid verification code",
    ar: "الكود غير صالح",
  },
  incorrectCode: {
    en: "Incorrect verification code",
    ar: "الكود غير صحيح",
  },
  expiredCode: {
    en: "Verification code is expired",
    ar: "الكود منتهي الصلاحيّة",
  },
  invalidToken: {
    en: "You're unauthorized",
    ar: "يجب عليك تسجيل الدخول",
  },
  hasNoRights: {
    en: "You don't have enough rights",
    ar: "ليس لديك الصلاحيّات الكافية",
  },
  phoneNotVerified: {
    en: "You have to verify your phone to use the app",
    ar: "يجب عليك تفعيل رقم هاتفك لتتمكن من إستخدام التطبيق",
  },
  emailNotUsed: {
    en: "Email is not used",
    ar: "البريد الإلكتروني غير مستخدم",
  },
  emailOrPhoneUsed: {
    en: "Email or phone is already used",
    ar: "البريد الإلكتروني أو رقم الهاتف مستخدم مسبقاً",
  },
  emailOrPhoneNotUsed: {
    en: "Email or phone is not used",
    ar: "البريد الإلكتروني أو رقم الهاتف غير مستخدم",
  },
  emailUsed: {
    en: "Email address is already used",
    ar: "البريد الإلكتروني مستخدم مسبقاً",
  },
  phoneUsed: {
    en: "Phone number is already used",
    ar: "رقم الهاتف مستخدم مسبقاً",
  },
  incorrectCredentials: {
    en: "Incorrect credentials",
    ar: "بيانات الدخول غير صحيحة",
  },
  incorrectOldPassword: {
    en: "Incorrect old password",
    ar: "كلمة المرور القديمة غير صحيحة",
  },
  invalidName: {
    en: "Name should be (8 ~ 64 characters) length",
    ar: "الإسم يجب أن يكون بين 8-64 حرفاً",
  },
  invalidEmail: {
    en: "Invalid email address",
    ar: "البريد الإلكتروني غير صالح",
  },
  invalidEmailOrPhone: {
    en: "Invalid email or phone",
    ar: "البريد الإلكتروني أو رقم الهاتف غير صالح",
  },
  invalidPhone: {
    en: "Invalid phone number",
    ar: "رقم الهاتف غير صالح",
  },
  invalidPassword: {
    en: "Password should be (8 ~ 32 characters) length",
    ar: "كلمة المرور يجب أن تكون بين 8-32 حرفاً",
  },
  invalidAddress: {
    en: "Invalid address",
    ar: "العنوان غير صالح",
  },
  invalidCity: {
    en: "Invalid city",
    ar: "معرّف المدينة غير صالح",
  },
  invalidRegion: {
    en: "Invalid city",
    ar: "معرّف المنطقة غير صالح",
  },
  invalidAddressTitle: {
    en: "Invalid address title",
    ar: "مُسمّى العنوان غير صالح",
  },
  invalidStreet: {
    en: "Invalid address street",
    ar: "عنوان الشارع غير صالح",
  },
});

const user = Object.freeze({
  invalidId: {
    en: "Invalid user id",
    ar: "معرّف المستخدم غير صالح",
  },
  notFound: {
    en: "User was not found",
    ar: "المستخدم غير موجود",
  },
  emailAlreadyVerified: {
    en: "Your email is already verified",
    ar: "تم التحقق من بريدك الإلكتروني مسبقاً",
  },
  phoneAlreadyVerified: {
    en: "Your phone is already verified",
    ar: "تم التحقق من رقم هاتفك مسبقاً",
  },
  invalidRole: {
    en: "Invalid user role",
    ar: "الصلاحية المختارة غير صالحة",
  },
  foundWithInvalidRole: {
    en: "User is registered with another role",
    ar: "المستخدم مسجّل بصلاحية أخرى",
  },
  alreadyVerified: {
    en: "User's email and phone are already verified",
    ar: "تم التحقق من رقم هاتف وبريد المستخدم مسبقاً",
  },
  addressMatch: {
    en: "Address is already added",
    ar: "العنوان مطابق لأحد العناوين المضافة مسبقاً",
  },
  invalidAddressId: {
    en: "Invalid address id",
    ar: "معرّف العنوان غير صالح",
  },
  hasOnlyOneAddress: {
    en: "You have only one address so you can't delete it",
    ar: "لديك عنوان واحد فقط لذلك لا يمكنك حذفه",
  },
  addressNotFound: {
    en: "Address is not added to your addresses",
    ar: "العنوان غير مُضاف لعناوينك",
  },
  unsupportedLanguage: {
    en: "Unsupported language",
    ar: "اللغة غير مدعومة",
  },
  noLanguage: {
    en: "Please specify your language language",
    ar: "من فضلك قم بإختيار لغتك",
  },
  unsupportedReceiverType: {
    en: "Unsupported receiver type",
    ar: "نوع المستقبل غير مدعوم",
  },
});

const city = Object.freeze({
  invalidId: {
    en: "Invalid city id",
    ar: "معرّف المدينة غير صالح",
  },
  notFound: {
    en: "City was not found",
    ar: "المدينة غير موجودة",
  },
  noCities: {
    en: "There're no cities registered yet",
    ar: "لا يوجد هناك مدن مسجّلة بعد",
  },
  alreadyRegistered: {
    en: "City is already registered",
    ar: "المدينة مسجّلة بالفعل",
  },
  invalidName: {
    en: "City's name should be 3-128 characters length",
    ar: "إسم المدينة يجب أن يكون بين 3-128 حرفاً",
  },
  invalidEnglishName: {
    en: "English city's name is incorrect",
    ar: "إسم المدينة الإنجليزي غير صحيح",
  },
  invalidArabicName: {
    en: "Arabic city's name is incorrect",
    ar: "إسم المدينة العربي غير صحيح",
  },
});

const region = Object.freeze({
  invalidId: {
    en: "Invalid region id",
    ar: "معرّف المنطقة غير صالح",
  },
  notFound: {
    en: "Region was not found",
    ar: "المنطقة غير موجودة",
  },
  noRegions: {
    en: "There're no regions registered for this city yet",
    ar: "لا يوجد هناك مناطق مسجّلة لهذه المدينة بعد",
  },
  alreadyRegistered: {
    en: "Region is already registered",
    ar: "المنطقة مسجّلة بالفعل",
  },
  invalidName: {
    en: "Regions's name should be 3-128 characters length",
    ar: "إسم المنطقة يجب أن يكون بين 3-128 حرفاً",
  },
  invalidEnglishName: {
    en: "English regions's name is incorrect",
    ar: "إسم المنطقة الإنجليزي غير صحيح",
  },
  invalidArabicName: {
    en: "Arabic regions's name is incorrect",
    ar: "إسم المنطقة العربي غير صحيح",
  },
  dontBelongToCity: {
    en: "Region doesn't belong to the selected city",
    ar: "المنطقة لا تنتمي للمدينة المختارة",
  },
});

const codes = Object.freeze({
  duplicateIndexKey: 11000,
});

module.exports = {
  system,
  auth,
  user,
  city,
  region,
  codes,
};
