package com.wipro.learning.collections;

import java.util.HashMap;
import java.util.Map;

		//                 Voting System[HashMap]
		//    Count votes for each candidate and find the winner.

public class VotingSystem {

	public static void main(String[] args) {

		String[] votes = { "A", "B", "A", "C", "B", "A" };

		// Key = candidate, Value = vote count
		HashMap<String, Integer> voteCount = new HashMap<>();

		// Count votes
		for (String v : votes) {

			if (voteCount.containsKey(v)) {
				voteCount.put(v, voteCount.get(v) + 1);
			} else {
				voteCount.put(v, 1);
			}
		}

		System.out.println("Vote Count: " + voteCount);

		// Find winner
		String winner = "";
		int maxVotes = 0;

		for (Map.Entry<String, Integer> entry : voteCount.entrySet()) {
			if (entry.getValue() > maxVotes) {
				maxVotes = entry.getValue();
				winner = entry.getKey();
			}
		}

		System.out.println("Winner: " + winner + " with votes: " + maxVotes);
	}
}