import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Performance testing settings
export let options = {
    stages: [
        { duration: '1m', target: 20 },  // simulate ramp-up of traffic from 1 to 20 users over 1 minute.
        { duration: '2m', target: 20 },  // stay at 20 users for 2 minutes.
        { duration: '1m', target: 0 },   // ramp-down to 0 users.
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'],  // 99% of requests must complete below 1.5s.
        errors: ['rate<0.01'],  // errors must be less than 1%.
    }
};

let errorRate = new Rate('errors');

export default function () {
    const res = http.get('https://api.covidtracking.com/v1/states/current.json');
    check(res, {
        'is status 200': (r) => r.status === 200,
        'is data present': (r) => r.json().length > 0,
    });

    // Record the error if the check fails
    errorRate.add(!result);
    sleep(1);  // simulate a think time of 1 second.
}

export function handleSummary(data) {
    var script_name = document.currentScript.src.split('/').pop();
    var report_name = `${script_name}_${report}`;
    return {
        report_name: htmlReport(data, { debug: true })
    };
}


