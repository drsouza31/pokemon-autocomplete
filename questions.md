### What is the difference between Component and PureComponent? Give an example where it might break my app

The difference happens when React is comparing the props/state from the component in order to re-render it.

Let's say we have a component X with this object in its props, that was passed by the parent: { property: 'initial-value' }
Then let's say its parent updated this object to { property: 'new value' }

If X is a PureComponent, React will compare previous props and see that the object reference didn't change, so it won't re-render (considering only this change)
On the other hand, if X is a regular Component, React will see that the object is not equals in the previous props, so there will be a re-render.

For example, if we want to show this property value on the screen and X is a Pure Component, this prop change could not being displayed in the screen.


### Context + ShouldComponentUpdate might be dangerous. Can think of why is that?

Well, when we use Context, we are dealing with global state of the app, that can be accessed by any component.

When customizing ShouldComponentUpdate function, we might make context stop working.

For example:
Let's say we have a context provider set on the application root node, and it contains the name of the logged user.
Then, in the tree, we have in diffrent branches:
- A component X, that updates the user name;
- A component Y, that shows the user name and implements the function ShouldComponentUpdate.

When the context changes, React will trust the ShouldComponentUpdate function of component Y, and may not update Y component, depending on the function logic.


### Describe 3 ways to pass information from a component to its PARENT.

a. The parent can send a function to update any of its information to the child, so the child can fire it:
```
function Parent () {
    const [value, setValue] = useState();
    return <Child updateValue={setValue}/>
}
```

b. We can use Context API, so the information will be shared with both components;

c. We can use a state management library, like Redux, so all the components can communicate through the reducers and actions.


### Give 2 ways to prevent components from re-rendering.

Back to the old days from Class React, we could implement the ShouldComponentUpdate function in order to prevent re-rendering.

Now we have some functions to do this job:
a. React.memo: a HOC that re-render the component only when a prop changes. It takes another component as parameter and it only evaluates it again when there is a change in its props.

b. React.useMemo: a hook that allows us to prevent functions re-executions (including functional components). It takes 2 parameters: the function and an array of dependencies. The function will be evaluated again only if something specified in the dependency array changes.


### What is a fragment and why do we need it? Give an example where it might break my app

A fragmentis a way of joining multiple react nodes in a single parent.

Let's say I have a Table component and I want to have a CustomRows component that will render all the rows of the table.
If we had something like this:
```
function CustomRows(props) {
    return props.data.map(item => <tr> {...} </tr>)
}
```
When the data prop have more than one item, and CustomRows is being used as a component, application will break cause a component must return one single React node.

So, we could solve this with he fragment:
```
function CustomRows(props) {
    return <React.Fragment>
        { props.data.map(item => <tr> {...} </tr>) }
    </React.Fragment>
}
```

### Give 3 examples of the HOC pattern

a. First example is the React.memo component that I mentioned above.

```
const memoizedComponent = React.memo(MyComponent)
```

It wraps a component to add the behavior of re-rendering it only when props change.


b. A very simple example could be a HOC to update some style in its child:
```
function BoldHOC (Child) {
    return <Child style={{fontWeight: 'bold'}}/>
}
```

c. A more "real-world" case would be using state. For example, let's say we ave different components that load customers. We could have the HOC:
```
function CustomerHOC (Child) {
    const [customers, setCustomers] = useState([])
    useEffect(() => {
        ...update customers
    })

    return <Child customers={customers}/>
}
```

PS: I don't thint using HOC like this is a good choice nowadays. I'd rather to create the "behavior that will be reused" as a hook.


### What's the difference in handling exceptions in promises, callbacks and async...await

When using callbacks (the oldest way), we usually pass 2 different functions as parameters: one to be called on success, and another one to handle some error. So, inside the function, we have to check the success and call each one of them.

When dealing with promises, we have the '.catch()' function to be used. when an error happens inside the promise function, it can be handled in the catch function, usually declare right after the '.then()' function.

Finally, when we are using async/await, we have to use try/catch blocks to deal with errors. When ome error happen inside the code block in try, then in the catch block we can handle it.


### How many arguments does setState take and why is it async

There are 2 parameters, but the second is optional.

The first one can be the new state (as an object), or a function that will have the previous state as parameter and will return the new state.

The second parameter, optional, is a callback to be called after the update is completed.

I think the method is async to avoid blocking the execution of all the application. If it would block the event loop while it is executed.


### List the steps needed to migrate a Class to Function Component.

Let's say we have X, that is a Class Component.

- First step would be create a function that returns what X had in the render method;
- Update the state changes to use the functions created by 'useState' hook, passing as initial value the state we had on constructor of X;
- Replace the methods componentDidUpdate, componentDidMount and componentWillUnmount using the useEffect hook. (Usually the logic inside componentDidMount will be the first execution of useEffect parameter function, componentDidUpdate will be handled with a combination of the function and the dependency array of useEffect, and finally componentWillUnmount will be replaced by the return of the useEffect function parameter);
- Replace the other methods of the class by functions.

I think this is it.


### List a few ways styles can be used with components.

a. We can use the 'styles' prop in each component;
b. We can import css files and use the css selectors. React components gotta use the 'className' prop instead of traditional 'class';
c. We can have a classes builder, like in MaterialUI library:
```
    const useStyles = makeStyles(theme => ({
        container: {
            display: 'flex',
            ...
        }
    }));
    ...
    const classes = useStyles();
    ...
    <MyComponent className={classes.container} />
```
d. We can use Styled Components:
```
    const MyContainer = styled.div`
        display: flex;
        ...
    `
```


### How to render an HTML string coming from the server

React provides the 'dangerouslySetInnerHTML' attribute, that sets the 'innerHTML' in the DOM element.
This way we can set a raw HTML retrived from the server.