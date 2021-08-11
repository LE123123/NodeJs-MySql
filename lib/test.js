const connection = require('./db');

exports.sort = () => {
    connection.query(`select * from topic`, (error1, data1) => {
        if(error1) throw error1;
        connection.query(`select * from topic order by author_id`, (error2, data2) => {
            if(error2) throw error2;
            var i = 0;
            for(i = 0; i < data2.length; i++) {
                console.log(`Doing ${i+1}st process`);
                connection.query(
                    `update topic set title=?, description=?, created=?, author_id=? where id=?`,
                    [data2[i].title, data2[i].description, data2[i].created, data2[i].author_id, data1[i].id],
                    (error3, data3) => {
                        if (error3) throw error3;
                });
            }
        });
    });
}
