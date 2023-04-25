const Mongoose = require('mongoose');

// LOG LEVELS
// 1-DEBUG: En düşük seviye, genellikle hata ayıklama için kullanılır. Sistemin detaylı çalışma bilgilerini içerir.
// 2-INFO: Genel bilgileri kaydeder, örneğin işlem başlatma ve bitirme zamanları, kullanıcı girişleri gibi.
// 3-WARNING: Uyarı seviyesi, sorunları gösterir ancak sistem çalışmaya devam eder.
// 4-ERROR: Hata seviyesi, ciddi hataları gösterir, ancak sistem çalışmaya devam eder.
// 5-CRITICAL: En yüksek seviye, ciddi hataları gösterir ve sistem çalışmayı durdurabilir.

const logSchema = new Mongoose.Schema({
    identity: {
        type: String,
        required: true,
    },
    application: {
        type: String,
        required: true,
    },
    version: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
})

const userShema = new Mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

Mongoose.connect("mongodb://localhost:27017/arena-log-db")
    .then(() => {
        console.log("MongoDB veritabanına bağlandı");
    })
    .catch((err) => {
        console.error("MongoDB bağlantı hatası:", err);
    });

module.exports = {
    Log: Mongoose.model("Log", logSchema),
    User: Mongoose.model("User", userShema),
};