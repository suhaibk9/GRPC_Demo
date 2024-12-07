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

const todos = [
  {
    id: 1,
    title: 'Buy milk',
    content: 'Go to the store and buy milk',
  },
  {
    id: 2,
    title: 'Buy bread',
    content: 'Go to the store and buy bread',
  },
];
const server = new grpc.Server();
server.addService(packageDescriptor.TodoService.service, {
  ListTodos: (call, callback) => {
    callback(null, {
      todos: todos,
    });
  },
  CreateTodo: (call, callback) => {
    const todo = call.request; //{ id: todos.length + 1, ...call.request };
    todos.push(todo);
    console.log('todos', todos);
    callback(null, todo);
  },
  GetTodo: (call, callback) => {
    let incomingRequest = call.request;
    let todoId = incomingRequest.id;
    let todo = todos.find((todo) => todo.id === todoId);
    if (todo) {
      callback(null, todo);
    } else {
      callback({ code: grpc.status.NOT_FOUND, details: 'Not found' }, null);
    }
  },
});

server.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log('Server running at http://127.0.0.1:50051');
  }
);
/**
call refers to the incoming request from the client
callback is the function that we call to send the response back to the client
like here we are sending the todos array back to the client
so callback function correspons to the rpc CreateTodo(Todo) returns (Todo) {} in the proto file
*/
