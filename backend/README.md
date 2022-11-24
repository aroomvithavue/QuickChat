# QuickChat Backend

## Setup

1. Add .env file to the root of the `backend/` folder and define MONGO_SRV
2. Run npm install

## Running localy

`npm run dev`

## API routes

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/chatRooms` - Get all the chat rooms

**Returns**

- An array of all chat rooms sorted in descending order by date created

#### `GET /api/chatRooms?keyword=KEY` - Gets a chat room by its keyword

**Returns**

- A chat room with a keyword of `keyword`

**Throws**

- `400` if `keyword` is not given
- `404` if no chat room has keyword of `keyword`

#### `POST /api/chatRooms` - Create a new chat room

**Body**

- `keyword` _{string}_ - keyword of chat room
- `days` _{string}_ - days until chat room expiration
- `hours` _{string}_ - hours until chat room expiration

**Returns**

- A success message
- A object with the created chat room

**Throws**

- `400` if the keyword is empty or corresponds to a chatroom that already exists
- `400` if days is not a non-negative integer
- `400` if hours is not a non-negative integer

#### `PATCH /api/chatRooms/:chatRoomId?` - Update an existing chat room by adding a new message

**Body**

- `message` _{string}_ - the content of the new message
- `author` _{string}_ - the author of the message

**Returns**

- A success message
- An object with the updated chat room

**Throws**

- `404` if the `chatRoomId` is invalid
- `400` if the message is empty
- `400` if the author is empty

#### `DELETE /api/chatRooms/:chatRoomId?` - Delete an existing chat room

**Returns**

- A success message

**Throws**

- `404` if the `chatRoomId` is invalid
