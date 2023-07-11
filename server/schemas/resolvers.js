const { AuthenticationError } = require('apollo-server-express'); // import AuthenticationError from apollo-server-express
const { User, Product, Category, Order } = require('../models'); // import User, Product, Category, and Order models
const { signToken } = require('../utils/auth'); // import signToken function from auth.js
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // import stripe package and secret key

const resolvers = { // create resolvers object
  Query: { // create Query object
    categories: async () => { // create categories resolver
      return await Category.find(); // return all categories
    },
    products: async (parent, { category, name }) => { // create products resolver
      const params = {}; // set params object to empty object

      if (category) { // if category exists
        params.category = category; // set params.category to category
      }

      if (name) { // if name exists
        params.name = { // set params.name to name
          $regex: name // set $regex to name
        };
      }

      return await Product.find(params).populate('category'); // return all products with params and populate category
    },
    product: async (parent, { _id }) => { // create product resolver
      return await Product.findById(_id).populate('category'); // return product by _id and populate category
    },
    user: async (parent, args, context) => { // create user resolver
      if (context.user) { // if context.user exists
        const user = await User.findById(context.user._id).populate({ // set user to user by context.user._id and populate orders
          path: 'orders.products', // set path to orders.products
          populate: 'category' // set populate to category
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate); // sort user.orders by purchaseDate

        return user; // return user
      }

      throw new AuthenticationError('Not logged in'); // throw AuthenticationError
    },
    order: async (parent, { _id }, context) => { // create order resolver
      if (context.user) { // if context.user exists
        const user = await User.findById(context.user._id).populate({ // set user to user by context.user._id and populate orders
          path: 'orders.products', // set path to orders.products
          populate: 'category' // set populate to category
        });

        return user.orders.id(_id); // return user.orders by _id
      }

      throw new AuthenticationError('Not logged in'); // throw AuthenticationError
    },
    checkout: async (parent, args, context) => { // create checkout resolver
      const url = new URL(context.headers.referer).origin; // set url to context.headers.referer.origin
      const order = new Order({ products: args.products }); // set order to new Order with args.products
      const line_items = []; // set line_items to empty array

      const { products } = await order.populate('products'); // set products to order.populate('products')

      for (let i = 0; i < products.length; i++) { // for loop through products
        const product = await stripe.products.create({ // set product to stripe.products.create
          name: products[i].name, // set name to products[i].name
          description: products[i].description, // set description to products[i].description
          images: [`${url}/images/${products[i].image}`] // set images to [`${url}/images/${products[i].image}`]
        });

        const price = await stripe.prices.create({ // set price to stripe.prices.create
          product: product.id, // set product to product.id
          unit_amount: products[i].price * 100, // set unit_amount to products[i].price * 100
          currency: 'usd', // set currency to 'usd'
        });

        line_items.push({ // push to line_items
          price: price.id, // set price to price.id
          quantity: 1 // set quantity to 1
        });
      }

      const session = await stripe.checkout.sessions.create({ // set session to stripe.checkout.sessions.create
        payment_method_types: ['card'], // set payment_method_types to ['card']
        line_items, // set line_items to line_items
        mode: 'payment', // set mode to 'payment'
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`, // set success_url to `${url}/success?session_id={CHECKOUT_SESSION_ID}`
        cancel_url: `${url}/` // set cancel_url to `${url}/`
      });

      return { session: session.id }; // return session.id
    }
  },
  Mutation: { // create Mutation object
    addUser: async (parent, args) => { // create addUser resolver
      const user = await User.create(args); // set user to User.create(args)
      const token = signToken(user); // set token to signToken(user)

      return { token, user }; // return { token, user }
    },
    addOrder: async (parent, { products }, context) => { // create addOrder resolver
      console.log(context); // console.log(context)
      if (context.user) { // if context.user exists
        const order = new Order({ products }); // set order to new Order with products

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } }); // await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order; // return order
      }

      throw new AuthenticationError('Not logged in'); // throw AuthenticationError
    },
    updateUser: async (parent, args, context) => { // create updateUser resolver
      if (context.user) { // if context.user exists
        return await User.findByIdAndUpdate(context.user._id, args, { new: true }); // return User.findByIdAndUpdate(context.user._id, args, { new: true })
      }

      throw new AuthenticationError('Not logged in'); // throw AuthenticationError
    },
    updateProduct: async (parent, { _id, quantity }) => { // create updateProduct resolver
      const decrement = Math.abs(quantity) * -1; // set decrement to Math.abs(quantity) * -1

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true }); // return Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true })
    },
    login: async (parent, { email, password }) => { // create login resolver
      const user = await User.findOne({ email }); // set user to User.findOne({ email })

      if (!user) { // if user doesn't exist
        throw new AuthenticationError('Incorrect credentials'); // throw AuthenticationError
      }

      const correctPw = await user.isCorrectPassword(password); // set correctPw to user.isCorrectPassword(password)

      if (!correctPw) { // if correctPw doesn't exist
        throw new AuthenticationError('Incorrect credentials'); // throw AuthenticationError
      }

      const token = signToken(user); // set token to signToken(user)

      return { token, user }; // return { token, user }
    }
  }
};

module.exports = resolvers; // export resolvers
