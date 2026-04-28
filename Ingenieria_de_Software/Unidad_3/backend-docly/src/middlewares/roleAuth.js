const jwt = require('jsonwebtoken');

const checkRole = (rolesPermitidos) => {
    return (req, res, next) => {
        try {
            const authHeader = req.headers.autorization || req.headers.authorization;
        if (!authHeader){
            return res.status(401).json({ error: "Acceso denegado: Token no proporcionado" });
        }

        const token = authHeader.split(' ')[1];

        const tokenData = jwt.verify(token, "Mi_llave_secreta");

        if (rolesPermitidos.includes(tokenData.rol)) {
            req.usuario = tokenData;
            next();
        } else {
            return res.status(403).json({ error: "Acceso denegado: Rol no autorizado" });
        }
        } catch (error) {
            res.status(401).json({ error: "Tu sesion es invalida o ya expiro" }); 
        }
    };
};

module.exports = { checkRole };