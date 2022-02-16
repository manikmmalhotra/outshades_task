# outshades_task

it's a basic Event Management sysytem (Backend)

# Routes: (base - localhost:4000)
1. User
- /user/signup 
- /user/login
- /user/logout (Bearer Token req)
- /update_password (Bearer Token req)
- /forgot_password
- /new_password

2. Events (Bearer Token req)
- /create_events 
- /check_invited_events
- /event_details/:id (no token required)
- /update_event/:id

