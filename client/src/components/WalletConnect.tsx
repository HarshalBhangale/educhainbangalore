import { useEffect, useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 137, 80001],
});

export default function WalletConnect() {
  const { active, account, activate, deactivate } = useWeb3React();
  const { toast } = useToast();
  const [tried, setTried] = useState(false);

  // Handle connection on mount
  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && !active && !tried) {
        activate(injected).catch(() => {
          setTried(true);
        });
      }
    });
  }, [activate, active, tried]);

  const connectWallet = async () => {
    try {
      await activate(injected);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please make sure MetaMask is installed and try again",
        variant: "destructive",
      });
      console.error("Failed to connect to MetaMask:", error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected wallet",
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {active ? (
        <Button onClick={disconnectWallet} variant="outline" size="sm">
          <Wallet className="mr-2 h-4 w-4" />
          {account?.slice(0, 6)}...{account?.slice(-4)}
        </Button>
      ) : (
        <Button onClick={connectWallet} size="sm">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
