import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

app.get("/accounts/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const result = accounts.find((account) => account.id === id)

        if (!result) {
            res.status(404)
            throw new Error("conta nao encontrada, verifique a `id` ")
        }

        res.status(200).send(result)
    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// Refatorar para o uso do bloco try/catch

// Validação de input:
// Caso a id recebida não inicie com a letra ‘a’ será retornado um erro 400
// Mensagem de erro:
// 	“‘id’ inválido. Deve iniciar com letra ‘a’”
app.delete("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        if (id[0] !== "a") {
            res.status(400)
            throw new Error("`id` inválido. Deve iniciar com letra `a`")
        }
        const accountIndex = accounts.findIndex((account) => account.id === id)


        if (accountIndex >= 0) {
            accounts.splice(accountIndex, 1)
            res.status(200).send("Item deletado com sucesso")
        } else {
            res.status(404).send("Item não existe no banco de dados")

            // res.status(404)
            // throw new Error ("Item não localizado") 
        }

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

    res.status(200).send("Item deletado com sucesso")
})


// req.body.type (newType)
// deve valer um dos tipos de conta do enum

app.put("/accounts/:id", (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const newId = req.body.id
        const newOwnerName = req.body.ownerName
        const newBalance = req.body.balance
        const newType = req.body.type
        

        
        if (newId !== undefined) {
            if(newId !== "a"){
        
                res.status(400)
                throw new Error("`newId` inválido. Deve iniciar com letra `a`")
            }
        }
        
        if(newOwnerName !== undefined){
            if(newOwnerName.length <2){
                res.status(400)
                throw new Error("`newId` deve ter mais de dois caracters")
            }
            if(newBalance<0){
                res.status(400)
                throw new Error("`id` inválido. Deve iniciar com letra `a`")

            }
        }

        // req.body.balance (newBalance)
        // Deve ser number
        if (typeof newBalance !== undefined) {
            if(typeof newBalance !== "number"){

                res.status(400)
                throw new Error("`balance` deve ser do tipo number ")
            }
        }
        // Deve ser maior ou igual a zero
        if (newBalance <= 0) {
            res.status(400)
            throw new Error("`balance`nao pode ser negativo ")

        }

        //req.body.type (newType)
        // deve valer um dos tipos de conta do enum

        if (newType !== undefined) {
            if (newType !== ACCOUNT_TYPE.GOLD &&
                newType !== ACCOUNT_TYPE.BLACK &&
                newType !== ACCOUNT_TYPE.PLATINUM) {
                    res.status(400)
                    throw new Error("`Type`deve ter um tipo valido: Platina, Ouro ou Black.")

            }
        }

        const account = accounts.find((account) => account.id === id)

        if (account) {
            account.id = newId || account.id
            account.ownerName = newOwnerName || account.ownerName
            account.type = newType || account.type

            account.balance = isNaN(newBalance) ? account.balance : newBalance
        }

        res.status(200).send("Atualização realizada com sucesso")

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)

    }

})

