package com.wipro.learning.collections;

public class Learner {

	private String name;
	private String video = "OFF";
	private String mic = "OFF";

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getVideo() {
		return video;
	}

	public void setVideo(String video) {
		this.video = video;
	}

	public String getMic() {
		return mic;
	}

	public void setMic(String mic) {
		this.mic = mic;
	}
	
	@Override
	public String toString() {
	    return "Learner{name='" + name + "', video=" + video + ", mic=" + mic + "}";
	}

}
