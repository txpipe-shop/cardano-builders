import { Client } from "./protocol";

const client = new Client({
  endpoint: "http://localhost:8164",
});

const lockTx = client.lockTx({
  quantity: 2000000,
  until: 1715289600,
  owner: "addr_test1vp044lyrq26h5gv8rhtqp5y8w4ndge9tvdu65t5qee58kaqthdt2h",
  beneficiary:
    "addr_test1vqsj204gwmxklmvkkd8jtxy9jc8qp70dxjel3w2555cnjwcefzlzc",
});

lockTx.then(console.log);
