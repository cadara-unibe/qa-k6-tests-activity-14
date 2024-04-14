import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

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
    const res = http.get('https://api.covidtracking.com/v1/states/ca/daily.json');
    const result = check(res, {
        'is status 200': (r) => r.status === 200,
        'is data for CA present': (r) => r.json()[0].state === 'CA',
    });

    // Record the error if the check fails
    errorRate.add(!result);
    sleep(1);  // simulate a think time of 1 second.
}

export function handleSummary(data) {
    var script_name = 'historic_values_for_a_single_state_tests';
    var report_name = `${script_name}_report.html`;
    return {
        report_name: htmlReport(data, { debug: true })
    };
}
