const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('todo.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const packageDescriptor = grpc.loadPackageDefinition(packageDefinition);
const client = new packageDescriptor.TodoService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);
client.ListTodos({}, (err, response) => {
  if (err) {
    console.error(err);
    return;
  }
  client.CreateTodo(
    {
      title: 'New Todo',
      completed: false,
    },
    (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(response);
    }
  );
});
