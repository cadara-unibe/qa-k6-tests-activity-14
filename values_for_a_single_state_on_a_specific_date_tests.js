import http from 'k6/http';
import { check } from 'k6';

export default function () {
    const res = http.get('https://api.covidtracking.com/v1/states/ca/20210101.json');
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is data for CA on specific date present': (r) => r.json().state === 'CA' && r.json().date === 20210101,
    });
}
