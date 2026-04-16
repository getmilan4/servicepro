

import oracledb from "oracledb";


export async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-chicago-1.oraclecloud.com))(connect_data=(service_name=g1451854dfb9e0f_login_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))",
  });
}

console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);

