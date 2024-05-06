import client from './0-redis_client';

function setNewSchool (schoolName, value) {
    client.set(schoolName, value, (err, reply) => {
        if (err) throw err;
        console.log(`School ${schoolName} added with value ${value}`);
    });
}

function displaySchoolValue (schoolName) {
    client.get(schoolName, (err, reply) => {
        if (err) throw err;
        console.log(reply);
    });
}

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');