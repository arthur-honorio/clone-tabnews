import { NextResponse } from "next/server";

function status(req, res) {
  res.json({ chave: "são acima da média" });
}

export default status;
