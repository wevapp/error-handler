Backend Restapi-
goalController-
    -Get all Goals [include user: req.user.id inside to find method for specific user]
    -Get Single Goal [Find the _id: req.params.id of Goal with user: req.user.id]
    -Create goal [Create new goal into specific user [include user: req.user.id inside to create method as a second parameter for specific user]]
    -Update goal
        * // find the goal by id(params) if existing into database
        * // find user by id(req.user.id) if existing into database 
        * // if goal.user.toString() !== user.id
            -goal.user: In your Mongoose schema for the Goals model, 
            the user field is defined as a reference to another document in the User collection. 
            This is represented as a Mongoose ObjectId. When you retrieve a goal from the database, 
            goal.user contains the ObjectId of the user associated with that goal.
        * // update the goal using another variable [const updatedGoal = await Goals.findByIdAndUpdate(id, req.body, {new: true})]
    -Delete goal
        * // find the goal by id(params) if existing into database
        * // Find user by id(req.user.id) if existing into database 
        * // make sure the logged in user matches the goal user
            if(goal.user.toString() !== user.id) {
                res.status(401);
                throw new Error('User not Authorized!');
            }
        * // Use deleteOne directly on the Mongoose model
            await Goals.deleteOne({ _id: id })
userController-