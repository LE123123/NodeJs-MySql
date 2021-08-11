const connection = require('./lib/db');

const create_promise = () => {
    return new Promise((resolve, reject) => {
        connection.query(`select * from topic`, (error, data) => {
            if (error) {
                reject('error');
            } else {
                resolve(data);
            }
        });
    });
}


const create_promise_2 = () => {
    return new Promise((resolve, reject) => {
        connection.query(`select * from author`, (error, data) => {
            if (error) {
                reject('error');
            } else {
                resolve(data);
            }
        })
    })
}
async function original() {
    try{
        const data_1 = await create_promise();
        const data_2 = await create_promise_2();
        console.log(data_1);
        console.log("=====================")
        console.log(data_2);
    } catch(error) {
        console.error(error);
    }
}


original();
