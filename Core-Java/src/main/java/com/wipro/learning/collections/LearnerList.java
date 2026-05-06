package com.wipro.learning.collections;

import java.util.ArrayList;
import java.util.List;

public class LearnerList {

	public static void main(String[] args) {

		Learner L1 = new Learner();
		L1.setName("Vishal");

		Learner L2 = new Learner();
		L2.setName("Aman");
		L2.setVideo("ON");

		Learner L3 = new Learner();
		L3.setName("Jessica");
		L3.setVideo("ON");
		L3.setMic("ON");

		Learner L4 = new Learner();
		L4.setName("Sakshi");
		L4.setVideo("ON");

		Learner L5 = new Learner();
		L5.setName("Ajit");
		L5.setVideo("ON");
		L5.setMic("ON");

		Learner L6 = new Learner();
		L6.setName("Sunny");
		L6.setVideo("ON");
		L6.setMic("ON");
		
		Learner L7 = new Learner();
		L7.setName("Nishi");
		L7.setVideo("ON");
		L7.setMic("ON");

		Learner L8 = new Learner();
		L8.setName("Shubhangi");
		L8.setVideo("ON");
		L8.setMic("ON");
		
		Learner L9 = new Learner();
		L9.setName("Vanshii");
		L9.setVideo("ON");
		L9.setMic("ON");

		Learner L10 = new Learner();
		L10.setName("Kavita");
		L10.setVideo("ON");
		L10.setMic("ON");
		
		// Learner List - 1

		List<Learner> learnerslist = new ArrayList<>();

		learnerslist.add(L1);
		learnerslist.add(L2);
		learnerslist.add(L3);

		for (Learner obj : learnerslist) {
			System.out.println(obj.getName() + "\n" + obj.getMic() + "\n" + obj.getVideo() + "\n");
		}
		
		// Learner List - 2

		List<Learner> learnerslist2 = new ArrayList<>();

		learnerslist2.add(L4);
		learnerslist2.add(L5);
		learnerslist2.add(L6); 

		for (Learner obj : learnerslist2) {
			System.out.println(obj.getName() + "\n" + obj.getMic() + "\n" + obj.getVideo() + "\n");
		}
		
		// Learner List - 3

		List<Learner> learnerslist3 = new ArrayList<>();

		learnerslist3.add(L7);
		learnerslist3.add(L8);

		for (Learner l : learnerslist3) {
			if (l.getName().endsWith("i")) {
				System.out.println(l.getName());
				System.out.println("mic: " + l.getMic());
				System.out.println("video: " + l.getVideo() + "\n");
			}
		}
		
		// Learner List - 4

		List<Learner> learnerslist4 = new ArrayList<>();

		learnerslist4.add(L9);
		learnerslist4.add(L10);
		
		 for(Learner l: learnerslist4)
		  {
			   if(l.getVideo().equals("ON") && l.getMic().equals("ON"))
			  {
	        System.out.println(l.getName());
	        System.out.println("mic: "+l.getMic());
	        System.out.println("video: "+l.getVideo()+"\n");
			  }
		}

		// Print Multiple ArrayList 

		List<List<Learner>> listofLearners = new ArrayList<>();
		listofLearners.add(learnerslist);
		listofLearners.add(learnerslist2);
		listofLearners.add(learnerslist3);
		listofLearners.add(learnerslist4);

		for (List<Learner> list : listofLearners) {
			System.out.println(list + "\n");
		}

	}

}
