import CardService from "../model/CardService.js";
import Payment from "../model/Payment.js";

// 📌 Get User's Purchased Services
export const getUserServices = async (req, res) => {
    console.log("firstcheck")
  try {
    const { user_id } = req.params;

    // Fetch successful payments
    const payments = await Payment.find({ user_id, status: "success" });

    // Fetch purchased services
    const services = await CardService.find({ user_id });

    res.status(200).json({
      success: true,
      payments,
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

  
  // 📌 Expire a Service
  export const expireService = async (req, res) => {
    try {
      const { service_id } = req.params;
      const service = await CardService.findById(service_id);
  
      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
  
      service.status = "Expired";
      await service.save();
  
      res.status(200).json({ success: true, message: "Service expired", data: service });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };