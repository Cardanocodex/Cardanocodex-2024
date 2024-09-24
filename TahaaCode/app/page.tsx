"use client";

import { useEffect, useState } from "react";
import { DynamicHookComponent } from "./_components/dinamycHook";
import { Wallet } from "./_components/wallet";
import { addDoc, collection, getDocs } from "firebase/firestore";
import db from "@/actions/firestore";

export default function Home() {
  const [useCustomHook, setUseCustomHook] = useState<any>(null);
  const [voted, setVoted] = useState<boolean | string>(false);

  const [votes, setVotes] = useState<
    {
      id: string;
      name: string;
      voteTxHash: string;
      address: string;
    }[]
  >([]);

  useEffect(() => {
    const loadHook = async () => {
      try {
        const { useWallet } = await import("@meshsdk/react");
        const { BrowserWallet } = await import("@meshsdk/core");
        setUseCustomHook(() => useWallet);
        const wallet = await BrowserWallet.enable("eternl");
        const balance = await wallet.getBalance();
        console.log("balance", balance);
      } catch (error) {
        console.error("Error loading hook:", error);
      }
    };

    loadHook();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "votes"));
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as {
        id: string;
        name: string;
        voteTxHash: string;
        address: string;
      }[];
      setVotes(data);
    };

    fetchItems();
  }, [voted]);

  if (useCustomHook === null) {
    return <div>Loading...</div>;
  }

  const { connected, name: walletName } = useCustomHook();

  const onClickVote = async (name: string) => {
    try {
      if (connected) {
        const { BrowserWallet, Transaction } = await import("@meshsdk/core");

        const wallet = await BrowserWallet.enable(walletName);

        const [address] = await wallet.getUsedAddresses();

        if (votes.find((votes) => votes.address === address) ? true : false) {
          setVoted(
            votes.find((votes) => votes.address === address)?.name ?? ""
          );

          return;
        }

        const tx = new Transaction({ initiator: wallet });

        tx.setMetadata(674, {
          msg: [`Voting to: ${name}`],
        });

        const unsignedTx = await tx.build();
        const signedTx = await wallet.signTx(unsignedTx);
        const txHash = await wallet.submitTx(signedTx);

        const docRef = await addDoc(collection(db, "votes"), {
          name: name,
          voteTxHash: txHash,
          address,
        });

        setVoted(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div
        style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}
      >
        <div>
          <Wallet />
          <DynamicHookComponent />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          {["Arun", "Siva", "Lakshmi"].map((card, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "30px",
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                transition: "transform 0.3s ease",
              }}
            >
              <h3 style={{ marginBottom: "20px", color: "#333" }}>{card}</h3>
              <button
                onClick={() => onClickVote(card)}
                style={{
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.3s ease",
                }}
              >
                Vote
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  gap: "10px",
                  marginTop: "20px",
                  padding: "10px",
                  backgroundColor: "#e9e9e9",
                  borderRadius: "8px",
                  maxHeight: "200px", // Optional: to limit the height of the scrollable area
                }}
              >
                <h4 style={{ marginBottom: "10px", color: "#333" }}>
                  Total Votes{" "}
                  {votes.filter((vote) => vote.name === card).length}
                </h4>
                {votes
                  .filter((vote) => vote.name === card)
                  .map((txHash, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        width: "200px",
                      }}
                    >
                      {txHash.voteTxHash}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {voted && (
        <div
          style={{
            padding: "20px",
            marginTop: "20px",
            backgroundColor: "#d4edda",
            border: "1px solid #c3e6cb",
            borderRadius: "8px",
            color: "#155724",
            textAlign: "center",
            fontSize: "16px",
          }}
        >
          {typeof voted === "string"
            ? `You have already voted to ${voted}`
            : "You have voted! Thanks"}
        </div>
      )}
    </main>
  );
}
