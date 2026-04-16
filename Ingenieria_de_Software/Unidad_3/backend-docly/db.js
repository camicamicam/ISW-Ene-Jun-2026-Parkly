const oracledb = require('oracledb');
//const path = require('path');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
//const walletPath = path.join(__dirname, 'wallet');

async function getConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: "backenduser",
            password: "zorroITQ2604",
            connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.mx-queretaro-1.oraclecloud.com))(connect_data=(service_name=g559b20f1aaca36_s52etnzap8x1a69t_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))",
            password: "zorroITQ2604"
        });
        return connection;
    } catch (err) {
        console.error("Error al conectar a la base de datos", err);
        throw err;
    }
}
module.exports = { getConnection }