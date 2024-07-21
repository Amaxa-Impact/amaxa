//TODO: the ablility for our landing site to fetch project data
import { NextApiRequest, NextApiResponse } from "next";

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  // find the data
  //TODO: find the project with this id, do a join and group the users by their roles, and parse that into an object then return it as json (users must have the isPublic option set to true)
  // return: { project: { name: string, users: { [role: string]: User[] }, coaches: { [role: string]: User } } }
}
