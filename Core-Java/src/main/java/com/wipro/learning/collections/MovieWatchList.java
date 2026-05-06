package com.wipro.learning.collections;

import java.util.ArrayList;

			//             Movie Watchlist[ArrayList]
			// 		Maintain a list of movies in the order added and allow users to search by name.

public class MovieWatchList {

    public static void main(String[] args) {

        ArrayList<String> movies = new ArrayList<>();

        movies.add("Inception");
        movies.add("Interstellar");
        movies.add("Avatar");

        String search = "Avatar";
        boolean found = false;

        // Search movie
        for (String m : movies) {
            if (m.equalsIgnoreCase(search)) {
                found = true;
                break;
            }
        }

        if (found)
            System.out.println("Movie found!");
        else
            System.out.println("Movie not found");
    }
}