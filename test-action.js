const { getAssignmentSubmissions } = require('./actions/teacher');
async function test() {
  const result = await getAssignmentSubmissions('1ca70bbb-f563-4385-ac4f-7dcc35d0982e');
  console.log(result);
}
test().catch(console.error);
