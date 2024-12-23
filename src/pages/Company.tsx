import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1>Company</h1>
      
      <Card className="p-6">
        <div className="space-y-6">
          <section>
            <h2>About Us</h2>
            <p className="text-muted-foreground">
              We are a leading provider of energy market data and analytics, helping businesses make informed decisions in the evolving energy landscape.
            </p>
          </section>

          <section>
            <h2>Our Mission</h2>
            <p className="text-muted-foreground">
              To empower organizations with comprehensive data and insights, enabling them to navigate the complexities of energy markets and drive sustainable growth.
            </p>
          </section>

          <section>
            <h2>Contact Information</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@fluxdataplatform.com</p>
              <p>Phone: +39 02 1234567</p>
              <p>Address: Via Example 123, 20123 Milan, Italy</p>
            </div>
          </section>

          <div className="flex justify-end space-x-4">
            <Button variant="outline">
              Download Company Profile
            </Button>
            <Button>
              Contact Us
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Company;