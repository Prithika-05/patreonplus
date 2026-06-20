const expiredSubscriptions =
 await Subscription.findAll({
   where: {
     status:"active",
     endDate:{
       [Op.lt]:
         new Date(),
     },
   },
 });