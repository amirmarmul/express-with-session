import express  from "express"
import session from "express-session"
import _FileStore  from "session-file-store"
const FileStore = _FileStore(session)
const app = express()

app.use(session({ 
    secret: "secret", 
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, 
    store: new FileStore(),
    unset: 'destroy'
}))

app.get("/", (req, res) => res.send("ok"))
app.get("/login", (req, res, next) => {
    req.session.uid = 123123
    next()
}, (req, res) => res.send("login"))

app.get("/logout", (req, res, next) => {
    req.session.destroy() 
    next()
}, (req, res) => {
    res.send("logout")
})

app.get("/guest",  (req, res, next) => {
    if (req.session.uid) {
        res.redirect("/authenticated")
    } else {
        next()
    }
}, (req, res) => {
    res.send("guest" + JSON.stringify(req.session))
})

app.get("/authenticated", (req, res, next) => {
    if (req.session.uid) {
        next()
    } else {
        res.redirect("/")
    }
}, (req, res) => {
    res.send("authenticated" + JSON.stringify(req.session))
})

app.listen(3000, _ => console.log("App listening @ 3000"))