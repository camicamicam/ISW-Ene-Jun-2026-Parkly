const oracledb = require('oracledb');
const path = require('path');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const walletPath = path.join(__dirname, 'wallet');

async function getConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: "backenduser",
            password: "zorroITQ2604",
            connectString: "localhost:1521/XEPDB1",
            configDir: walletPath
        });
        return connection;
    } catch (err) {
        console.error("Error al conectar a la base de datos", err);
        throw err;
    }
}
module.exports = { getConnection }