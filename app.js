// INTRODUCING PROMISES
// Why use Promises: to eliminate having to use callback() functions inside of a function. This can get really messy and hard to read. It creates “callback hell”
// What are Promises? An object representing the eventual completion or failure of an asynchronous operation. They’re used when some part of the function takes time, like fetching data using a http request. 
// It provides a way to work with asynchronous code in a more structured and manageable manner.


//Creating a Promise:
// - Will always take resolve and reject parameters 
// - resolve and reject are functions
// - a promises status/state is either pending, resolved or rejected. These values are stored on the hidden PromiseState property on the promise object.

// handy hints: to see status of a promise, type its name eg willGetYouDog (w/o: ()) into the DOM console. This will return an object desplaying the properties PromiseStatus and PromiseValue.

//CREATING A PROMISE
//this promise will randomly resolve/reject

// const willGetYouDog = new Promise ((resolve, reject) => {
//     const rand = Math.random();
//     if (rand < 0.5) {
//         resolve();
//     } else {
//         reject();
//     }
// });

//HANDLING A PROMISE
// How do we continue to run code according to the outcome of the PromiseStatus? With Handlers!
// If its resolved -> .then() method! 
// If the PromiseStatus's value is "resolved" then the callback code inside of .then() will be executed. 
// This is becuase the .then() callback function is registered in the hidden PromiseFulfillReactions property on the promise object. 
// When the Promise transitions to the "fulfilled" state (i.e., its PromiseStatus changes to "fulfilled"), the fulfillment reactions (i.e., the callback functions from .then()) are executed.

// willGetYouDog.then(() => {
//     console.log("Yay, we got a dog")
// });

// If the PromiseStatus value is rejected then -> .catch() method.
// The callback inside of the .catch() method is registered to the hidden PromiseRejectReactions property on the promise object. 
// When the Promise transitions to the "rejected" state (i.e., its PromiseStatus changes to "rejected"), the fulfillment reactions (i.e., the callback functions from .catch()) are executed.

// willGetYouDog.catch(() => {
//     console.log("No dog")
// });

// This example could just be a if else statement, its not actually going off and doing something that takes time.

//RETURNING PROMISES FROM FUNCTIONS
// We can make a function that returns a promise
// This promise takes 5 seconds before its resoved or rejected

// const makeDogPromise = () => {
//     return new Promise ((resolve, reject) => {
//         setTimeout(() => {
//             const rand = Math.random();
//             if (rand < 0.5) {
//                 resolve();
//             } else {
//                 reject();
//             }
//         }, 5000)
//     });
// };

// You can chain .then() and .catch() together without referencing the variable or promise.
// makeDogPromise()
//     .then(() => {
//         console.log("Yay, we got a dog")
//     })
//     .catch(() => {
//         console.log("No dog")
// });

// RESOLVING AND REJECTING WITH VALUES
// We can resolve and reject and pass in data values
// This example uses a fake api

// const fakeRequest = (url) => {
//     return new Promise ((resolve, reject) => {
//         setTimeout(() => {
//             const pages = {
//                 "/users": [
//                     {id: 1, username: "Bilbo"},
//                     {id: 5, username: "Esmerelda"}
//                 ],
//                 '/about': "This is the about page."
//             }
//             const data = pages[url]
//             if (data) {
//                 resolve({status: 200, data});
//             } else {
//                 reject({status: 404})
//             }
//         }, 1000)
//     });
// };

// fakeRequest("/users")
//     .then((res)=> {
//         console.log("Status Code", res.status)
//         console.log("Data", res.data)
//         console.log("request worked")
//     })
//     .catch((res) => {
//         console.log(res.staus)
//         console.log("request failed")
//     });

// fakeRequest("/pages")
//     .then((res)=> {
//         console.log("Status Code", res.status)
//         console.log("Data", res.data)
//         console.log("request worked")
//     })
//     .catch((res) => {
//         console.log(res.staus)
//         console.log("request failed")
//     });

//     // fill reject as there is no /dogs page
// fakeRequest("/dogs")
//     .then((res)=> {
//         console.log("Status Code", res.status)
//         console.log("Data", res.data)
//         console.log("request worked")
//     })
//     .catch((res) => {
//         console.log(res.staus)
//         console.log("request failed")
//     });

//  PROMISE CHANING
//It takes 1 second to resolve or reject the promise, depending on the url that is passed in
const fakeRequest = (url) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const pages = {
				'/users'        : [
					{ id: 1, username: 'Bilbo' },
					{ id: 5, username: 'Esmerelda' }
				],
				'/users/1'      : {
					id        : 1,
					username  : 'Bilbo',
					upvotes   : 360,
					city      : 'Lisbon',
					topPostId : 454321
				},
				'/users/5'      : {
					id       : 5,
					username : 'Esmerelda',
					upvotes  : 571,
					city     : 'Honolulu'
				},
				'/posts/454321' : {
					id    : 454321,
					title :
						'Ladies & Gentlemen, may I introduce my pet pig, Hamlet'
				},
				'/about'        : 'This is the about page!'
			};
			const data = pages[url];
			if (data) {
				resolve({ status: 200, data }); //resolve with a value!
			}
			else {
				reject({ status: 404 }); //reject with a value!
			}
		}, 1000);
	});
};

// If a .then() is returning a promise, you can chain them on the same level
fakeRequest('/users')
	.then((res) => {
		console.log(res);
		const id = res.data[0].id;
		return fakeRequest(`/users/${id}`);
	})
	.then((res) => {
		console.log(res);
		const postId = res.data.topPostId;
		return fakeRequest(`/posts/${postId}`);
	})
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.log('OH NO!', err);
	});

// ************************************************
// ATTEMPT 2 (deliberate error to illustrate CATCH)
// ************************************************
// fakeRequest('/users')
// 	.then((res) => {
// 		console.log(res);
// 		const id = res.data[0].id;
// 		return fakeRequest(`/useALSKDJrs/${id}`); //INVALID URL, CATCH WILL RUN!
// 	})
// 	.then((res) => {
// 		console.log(res);
// 		const postId = res.data.topPostId;
// 		return fakeRequest(`/posts/${postId}`);
// 	})
// 	.then((res) => {
// 		console.log(res);
// 	})
// 	.catch((err) => {
// 		console.log('OH NO!', err);
// 	});

// 